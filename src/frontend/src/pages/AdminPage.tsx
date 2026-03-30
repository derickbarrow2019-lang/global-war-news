import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit2,
  Globe,
  Loader2,
  LogIn,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useIsAdmin,
  useToggleBreaking,
  useUpdateArticle,
} from "../hooks/useQueries";
import { categoryColor, formatDate } from "../utils/format";

const EMPTY_FORM = {
  title: "",
  summary: "",
  content: "",
  author: "",
  category: "World",
  imageUrl: "",
  isBreaking: false,
};

type FormData = typeof EMPTY_FORM;

interface AdminPageProps {
  onBack: () => void;
}

const SKELETON_IDS = ["sk0", "sk1", "sk2"];

export default function AdminPage({ onBack }: AdminPageProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: articles, isLoading: loadingArticles } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const toggleBreaking = useToggleBreaking();

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (article: Article) => {
    setForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      author: article.author,
      category: article.category,
      imageUrl: article.imageUrl,
      isBreaking: article.isBreaking,
    });
    setEditingId(article.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      const articleData: Article = {
        id: editingId ?? 0n,
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        author: form.author.trim() || "Staff Reporter",
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        isBreaking: form.isBreaking,
        publishedAt: editingId ? 0n : BigInt(Date.now()) * 1_000_000n,
        views: 0n,
      };
      if (editingId !== null) {
        await updateArticle.mutateAsync(articleData);
        toast.success("Article updated.");
      } else {
        await createArticle.mutateAsync(articleData);
        toast.success("Article published.");
      }
      resetForm();
    } catch {
      toast.error("Failed to save article. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <main
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 flex flex-col items-center"
        data-ocid="admin.panel"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="self-start mb-8 text-muted-foreground gap-2"
          data-ocid="admin.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-brand" />
          </div>
          <h1 className="font-black text-2xl mb-3">GWN Admin Panel</h1>
          <p className="text-muted-foreground mb-8">
            Sign in with Internet Identity to manage news articles and breaking
            alerts.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="bg-brand text-background hover:bg-brand/90 font-semibold w-full max-w-xs"
            data-ocid="admin.login_button"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 w-4 h-4" />
            )}
            {isLoggingIn ? "Signing In…" : "Sign In with Internet Identity"}
          </Button>
        </div>
      </main>
    );
  }

  if (checkingAdmin) {
    return (
      <main
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 text-center"
        data-ocid="admin.panel"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-8 text-muted-foreground gap-2"
          data-ocid="admin.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <p className="text-muted-foreground">
          You do not have admin privileges.
        </p>
        <Button
          variant="ghost"
          onClick={clear}
          className="mt-4 text-muted-foreground"
        >
          Sign Out
        </Button>
      </main>
    );
  }

  const isSaving = createArticle.isPending || updateArticle.isPending;

  return (
    <main
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6"
      data-ocid="admin.panel"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground gap-2"
            data-ocid="admin.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-black text-2xl">Admin Panel</h1>
          <Badge className="bg-breaking/20 text-breaking border-breaking/30 text-xs">
            Admin
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {!showForm && (
            <Button
              size="sm"
              className="bg-brand text-background hover:bg-brand/90 gap-1 font-semibold"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4" /> New Article
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Article form */}
      {showForm && (
        <div
          className="bg-card border border-border rounded p-6 mb-8"
          data-ocid="admin.dialog"
        >
          <h2 className="font-bold text-lg mb-6">
            {editingId ? "Edit Article" : "New Article"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label
                  htmlFor="title"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Breaking: Enter headline here"
                  className="bg-secondary border-border"
                  data-ocid="admin.title.input"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="summary"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Summary / Lead
                </Label>
                <Textarea
                  id="summary"
                  value={form.summary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, summary: e.target.value }))
                  }
                  placeholder="Brief 1-2 sentence summary for article cards…"
                  className="bg-secondary border-border resize-none"
                  rows={2}
                  data-ocid="admin.summary.textarea"
                />
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="content"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Full Content *
                </Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="Full article content. Separate paragraphs with blank lines."
                  className="bg-secondary border-border resize-none"
                  rows={8}
                  data-ocid="admin.content.textarea"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="author"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Author
                </Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, author: e.target.value }))
                  }
                  placeholder="Staff Reporter"
                  className="bg-secondary border-border"
                  data-ocid="admin.author.input"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    className="bg-secondary border-border"
                    data-ocid="admin.category.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Middle East">Middle East</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Africa">Africa</SelectItem>
                    <SelectItem value="World">World</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="imageUrl"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/…"
                  className="bg-secondary border-border"
                  data-ocid="admin.image_url.input"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="breaking"
                  checked={form.isBreaking}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isBreaking: v }))
                  }
                  data-ocid="admin.breaking.switch"
                />
                <Label
                  htmlFor="breaking"
                  className="font-semibold text-sm cursor-pointer"
                >
                  Breaking News
                  {form.isBreaking && (
                    <span className="ml-2 text-xs text-breaking">● LIVE</span>
                  )}
                </Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-brand text-background hover:bg-brand/90 font-semibold"
                data-ocid="admin.submit_button"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : null}
                {isSaving
                  ? "Publishing…"
                  : editingId
                    ? "Update Article"
                    : "Publish Article"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                className="text-muted-foreground"
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Articles list */}
      <div>
        <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">
          All Articles ({articles?.length ?? 0})
        </h2>
        {loadingArticles ? (
          <div className="space-y-3" data-ocid="admin.loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-20 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-2" data-ocid="admin.table">
            {(articles || []).length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.empty_state"
              >
                No articles yet. Create your first article above.
              </div>
            )}
            {(articles || []).map((article, i) => (
              <div
                key={article.id.toString()}
                className="bg-card border border-border rounded p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                data-ocid={`admin.row.${i + 1}`}
              >
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {article.isBreaking && (
                      <span className="text-xs font-bold text-breaking">
                        ● BREAKING
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded uppercase ${categoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-foreground line-clamp-1">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {article.author} · {formatDate(article.publishedAt)} ·{" "}
                    {Number(article.views).toLocaleString()} views
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`text-xs gap-1 ${
                      article.isBreaking
                        ? "text-breaking"
                        : "text-muted-foreground"
                    }`}
                    onClick={async () => {
                      await toggleBreaking.mutateAsync(article.id);
                      toast.success(
                        article.isBreaking
                          ? "Breaking removed."
                          : "Marked as breaking.",
                      );
                    }}
                    disabled={toggleBreaking.isPending}
                    data-ocid={`admin.toggle.${i + 1}`}
                  >
                    <Zap className="w-3 h-3" />
                    {article.isBreaking ? "Unbreak" : "Break"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground gap-1"
                    onClick={() => handleEdit(article)}
                    data-ocid={`admin.edit_button.${i + 1}`}
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive gap-1"
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This will permanently delete &ldquo;{article.title}
                          &rdquo;. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="bg-secondary border-border"
                          data-ocid="admin.cancel_button"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={async () => {
                            await deleteArticle.mutateAsync(article.id);
                            toast.success("Article deleted.");
                          }}
                          data-ocid="admin.confirm_button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
