import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Article = {
    id : Nat;
    title : Text;
    summary : Text;
    content : Text;
    category : Text;
    imageUrl : Text;
    isBreaking : Bool;
    publishedAt : Int;
    author : Text;
    views : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Article {
    public func compareByViews(a : Article, b : Article) : Order.Order {
      Nat.compare(b.views, a.views);
    };
  };

  system func preupgrade() { };
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let articles = Map.empty<Nat, Article>();
  var nextId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getArticles() : async [Article] {
    articles.values().toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    articles.values().toArray().filter(func(a) { Text.equal(a.category, category) });
  };

  public query ({ caller }) func getBreakingNews() : async [Article] {
    articles.values().toArray().filter(func(a) { a.isBreaking });
  };

  public query ({ caller }) func getArticle(id : Nat) : async Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query ({ caller }) func searchArticles(searchQuery : Text) : async [Article] {
    articles.values().toArray().filter(
      func(a) {
        a.title.contains(#text searchQuery) or a.summary.contains(#text searchQuery) or a.content.contains(#text searchQuery)
      }
    );
  };

  public shared ({ caller }) func createArticle(article : Article) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };
    let newArticle : Article = {
      article with
      id = nextId;
      publishedAt = Time.now();
      views = 0;
    };
    articles.add(nextId, newArticle);
    nextId += 1;
    newArticle.id;
  };

  public shared ({ caller }) func updateArticle(updated : Article) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    switch (articles.get(updated.id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?_existing) {
        let updatedArticle : Article = {
          updated with
          publishedAt = Time.now();
        };
        articles.add(updated.id, updatedArticle);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    if (articles.get(id) == null) {
      Runtime.trap("Article not found");
    };
    articles.remove(id);
  };

  public shared ({ caller }) func toggleBreaking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle breaking status");
    };
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) {
        articles.add(id, { article with isBreaking = not article.isBreaking });
      };
    };
  };

  public query ({ caller }) func getTrendingArticles() : async [Article] {
    if (articles.isEmpty()) { return [] };
    articles.values().toArray().sort(Article.compareByViews);
  };
};
