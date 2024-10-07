import { IconSvgProps } from "@/types"

const BurgerIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M4 18L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export default BurgerIcon