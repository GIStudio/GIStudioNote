#!/usr/bin/env python3
"""Zero-order empirical entropy of a byte string and its Base64 encoding.

Used by content/Math/information-entropy-and-reversible-transforms.md to show
that a bijective re-encoding preserves total information, while symbol-level
entropy changes because the symbol boundaries change.
"""

from __future__ import annotations

import base64
import collections
import math


def zero_order_entropy(data: bytes) -> tuple[float, int]:
    n = len(data)
    freq = collections.Counter(data)
    h = -sum(c / n * math.log2(c / n) for c in freq.values())
    return h, n


def report(label: str, data: bytes, unit: str) -> None:
    h, n = zero_order_entropy(data)
    print(f"{label:<12} n={n:<5} H/{unit}={h:.3f}  total={h * n:.0f} bits")


def main() -> None:
    text = (
        "Information theory measures uncertainty, not file size. "
        "A reversible transform can rename every symbol without changing "
        "how much uncertainty the source carries. " * 3
    ).encode()

    report("raw text", text, "byte")
    report("base64", base64.b64encode(text), "char")

    # 256 byte values repeated three times: the ideal case where the encoded
    # stream is uniform over its 64-symbol alphabet.
    uniform = bytes(range(256)) * 3
    report("raw unif.", uniform, "byte")
    report("b64 unif.", base64.b64encode(uniform), "char")


if __name__ == "__main__":
    main()
