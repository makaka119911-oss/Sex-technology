import { cva, type VariantProps } from "class-variance-authority"

/* Кнопки в духе .btn / .btn-primary / .nav-shop-btn из лендинга */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#800020] to-[#b22234] text-white uppercase tracking-wide shadow-[0_0_25px_rgba(128,0,32,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(128,0,32,0.6)] active:translate-y-0",
        outline:
          "border-2 border-white/90 bg-white/[0.08] text-white hover:bg-white/[0.18] hover:shadow-[0_0_24px_rgba(255,255,255,0.2)]",
        secondary:
          "border-2 border-white/30 bg-white/10 text-white hover:border-[#800020] hover:bg-[rgba(128,0,32,0.2)]",
        ghost:
          "border-transparent bg-transparent text-white/90 hover:bg-white/10 hover:text-white",
        destructive:
          "bg-red-500/15 text-red-400 hover:bg-red-500/25 focus-visible:ring-red-500/40",
        link: "border-transparent text-[#d4af37] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 rounded-2xl px-4 text-[13px] sm:px-6 sm:text-[14px]",
        xs: "h-7 gap-1 rounded-xl px-3 text-xs",
        sm: "h-8 gap-1.5 rounded-xl px-3.5 text-[13px]",
        lg: "h-11 gap-2 rounded-2xl px-6 text-[14px] sm:px-8",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
