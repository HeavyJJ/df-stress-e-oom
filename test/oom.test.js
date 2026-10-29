import test from "node:test";
import assert from "node:assert/strict";
import { sum } from "../src/sum.js";
// Off-heap memory bomb (v19 memory_limit case).
// Buffers live OUTSIDE the V8 heap, so V8's own heap ceiling does not stop this
// (an on-heap string bomb hits "JavaScript heap out of memory" first and ends as
// not_reproduced instead). It touches ~1.5 GB of pages.
//  - GitHub runner (~7 GB RAM): the allocation completes, then the off-by-one count
//    assertion below is red, so the check fails and Draft Fixer is triggered.
//  - Draft Fixer server: the per-run 640 MiB memory cgroup kills the child during the
//    allocation, before any assertion runs -> refusal memory_limit, no model, no draft.
test("allocates past the per-run memory limit", () => {
  const held = [];
  for (let i = 0; i < 1536; i += 1) held.push(Buffer.alloc(1024 * 1024, i & 0xff));
  assert.equal(sum(2, 3), 5);
  assert.equal(held.length, 1537);
});
// Night 10 final-build (v27) trigger
// night12 v28 rerun
// night15 v33 E5 trigger
// night18 v34 retrigger
