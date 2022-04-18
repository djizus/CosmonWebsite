type ToastContainerProps = {
  type: 'success' | 'pending' | 'error'
  children: React.ReactNode
}

export function ToastContainer({ type, children }: ToastContainerProps) {
  return (
    <div>
      <div className="text-[22px] font-semibold">
        {type === 'success' && 'Transaction confirmed'}
        {type === 'pending' && 'Transaction in progress'}
        {type === 'error' && 'Transaction failed'}
      </div>
      {children}
    </div>
  )
}
