type LoadingProps = {
  textColor: string
}

export function Loading({ textColor }: LoadingProps) {
  return (
    <div className={`font-display text-[30px] leading-none ${textColor}`}>
      Loading...
    </div>
  )
}
