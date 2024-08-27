# Deno + Vue

This directory explores how to share the TypeScript code for a Provider between
a Vue frontend and a Deno app for the terminal.

Turns out you can pretty easily import code with full absolute paths in Deno and
TypeScript today supports full paths with a `.ts` extension as well.

Spawning Workers needs some consideration, as Deno does not have Shared Web Workers.
Then again, so does (or rather doesn't) Chrome on Android. To keep the interface
simple, Deno should probably just use a dedicated Worker as well; even though that
isn't needed to avoid blocking UI rendering threads.

Detection inside the Worker is a little more finnicky as you can't *just* do an
`if (self instanceof SharedWorkerGlobalScope) ..` because that identifier is not
defined when you're not in a Shared Worker .. so you can't compare to it either.
The constructor name is a good indicator though. But then TypeScript still needs
the instanceof for typing.
