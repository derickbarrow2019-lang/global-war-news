# Global War News

## Current State
New project. Empty Motoko backend and no frontend.

## Requested Changes (Diff)

### Add
- News article data model: id, title, summary, content, category, imageUrl, isBreaking, publishedAt, author
- Categories: Middle East, Europe, Africa, World
- CRUD operations for articles (admin only)
- Article listing with category filter and search
- Breaking news flag and alert system
- Role-based access: admin vs public reader
- Blob storage for article images
- Authorization for admin panel

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Article storage (stable var array), CRUD methods, category filter, search, breaking news query, role-based write access via authorization component
2. Frontend: Dark-themed news site with homepage (trending/breaking), category tabs, article detail page, admin panel to create/edit/delete articles, search bar, breaking news banner
3. Components: authorization (admin panel), blob-storage (article images)
