# Security Specification: Birthday Gift Keepsake

## 1. Data Invariants
1. Every document in `/gifts/{giftId}` must have a valid alphanumeric/hyphen/underscore `giftId` matching `^[a-zA-Z0-9_\-]+$` (max 64 chars) and matching `incoming().id == giftId`.
2. `ownerId` must equal `request.auth.uid` on creation and remain immutable on all updates (`incoming().ownerId == existing().ownerId`).
3. Only authenticated, email-verified users (`request.auth != null && request.auth.token.email_verified == true`) can create, update, delete, or list their own gifts (`resource.data.ownerId == request.auth.uid`).
4. `createdAt` must equal `request.time` on creation and remain immutable on updates; `updatedAt` must equal `request.time` on both creation and updates.
5. `passcodeHash` must always be a 64-character lowercase SHA-256 hex string (`^[a-f0-9]{64}$`); plaintext passcodes are never stored.
6. `flowerCompliments` is strictly bounded (`size() >= 1 && size() <= 6`) with string type verification on the first element.
7. `memories` is strictly bounded (`size() >= 1 && size() <= 6`) with map structure, caption/dateLabel/presetArt/imageData type and size checks on the first element.
8. Strict key allowlisting (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update) blocks shadow fields.
9. Blanket `list` queries on `/gifts` are forbidden; `allow list` enforces `isSignedIn() && resource.data.ownerId == request.auth.uid`.

## 2. The "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Create**: Create `/gifts/gift-1` with `request.auth == null`.
2. **Unverified Email Create**: Create `/gifts/gift-1` with `email_verified == false`.
3. **Identity Spoofing**: Authenticated user A attempts to create `/gifts/gift-1` with `ownerId: "user-B"`.
4. **Shadow Field Injection (Create)**: Create `/gifts/gift-1` including extra field `isAdmin: true`.
5. **Shadow Field Injection (Update)**: Owner updates `/gifts/gift-1` including `affectedKeys` with extra field `role: "superuser"`.
6. **ID Poisoning**: Create `/gifts/invalid$id*with!badchars` or 500-char ID.
7. **Owner Transfer Attack**: Owner attempts to update `ownerId` to another UID.
8. **Timestamp Forgery**: Create or update with client-supplied `createdAt` or `updatedAt` != `request.time`.
9. **Immutable CreatedAt Mutation**: Owner attempts to alter `createdAt` during update.
10. **Denial-of-Wallet Oversized Letter / Array Overflow**: Update `letterBody` with > 3000 chars or `flowerCompliments` with 25 items.
11. **Invalid Passcode Hash Format**: Write plaintext `"1234"` into `passcodeHash` instead of 64-char hex digest.
12. **Unauthorized List Scraping / Cross-User Update**: Unauthenticated or non-owner calls `list` on `/gifts` without `ownerId == request.auth.uid`, or User B tries to update/delete User A's gift.
