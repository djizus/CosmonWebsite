import Button from '../components/Button/Button'

export default function Subscribe() {
  return (
    <div>
      <h2>Don't miss a drop ever again!</h2>
      <input type="text" value="" placeholder="Enter your email address" />
      <Button withDirection="right">Subscribe</Button>
    </div>
  )
}
