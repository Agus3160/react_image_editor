import { LoaderCircle } from 'lucide-react'

type Props = {
  size?: number
  className?: string
}

export default function Loading({
  size = 32,
  className
}: Props) {
  return (
    <LoaderCircle 
      size={size}
      className={`animate-spin ${className}`}
    />
  )
}