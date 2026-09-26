// lib/easing.ts
export const ease = {
  linear:  (t: number) => t,
  inOut:   (t: number) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2,
  out:     (t: number) => 1 - Math.pow(1 - t, 3),
  in:      (t: number) => t * t * t,
  outBack: (t: number) => 1 + 2.7*Math.pow(t-1,3) + 1.7*Math.pow(t-1,2),
  expo:    (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10*t),
};

export type EaseName = keyof typeof ease;
