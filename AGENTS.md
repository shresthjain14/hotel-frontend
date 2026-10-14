<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared hotel data, image references, pricing calculations, and contact details centralized in `src/lib/hotel.ts` so every route stays consistent.
- Keep global navigation, footer, image fallback, and shared page presentation in `src/components/site.tsx` to preserve one visual language across the multi-page site.
- Render owner and manager messages with the shared LeadershipSection and centralized hotel data; nullable portraits keep unprovided identities from being fabricated.
- Keep guest recommendations as a public, input-validated server function calling server-only AI Gateway helpers; this provides hotel advice without exposing credentials or requiring guest accounts.
- Persist AI access blocks in the service-only availability table and disable automatic retries; terminal provider errors must not trigger repeated paid calls.
- Keep the hero video playlist in centralized hotel data and advance on video completion; this plays uploaded clips in sequence without downloading all six simultaneously.
- Keep hero music in a separate looping audio player started by the guest; browser sound policies require a click and music must remain uninterrupted between video clips.
