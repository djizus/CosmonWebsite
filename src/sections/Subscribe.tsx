import { useState } from 'react'
import Button from '../components/Button/Button'

export default function Subscribe() {
  const [email, set_email] = useState('')
  return (
    <div>
      <h2 className="mx-auto max-w-[448px]">Don't miss a drop ever again!</h2>
      <div className="items-center gap-x-[10px] lg:flex lg:justify-center lg:pt-[60px]">
        <div className="pt-[60px] lg:w-[468px] lg:pt-0">
          <input
            onChange={(e) => set_email(e.target.value)}
            value={email}
            type="text"
            className="primary-text"
            placeholder="Enter your email address"
          />
        </div>
        <div className="pt-6 lg:pt-0">
          <Button
            icon={{
              direction: 'right',
              position: 'right',
            }}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}
