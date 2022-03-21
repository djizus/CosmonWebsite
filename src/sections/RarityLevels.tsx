import Button from '../components/Button/Button'
import RarityLevel from '../components/RarityLevel/RarityLevel'

export default function RarityLevels() {
  return (
    <>
      <h2>Six rarity levels</h2>
      <p className="pt-4">
        And so many opportunities to evolve. Start the adventure with a common,
        climb the levels with him as you win, and finish with a Divinity. Lead
        your battles to victory and become the greatest war hero incarnate in
        the entire universe.
      </p>

      <div className="rarity-levels flex flex-col items-center gap-y-9 pt-6">
        <RarityLevel type="common" />
        <RarityLevel type="uncommon" />
        <RarityLevel type="rare" />
        <RarityLevel type="epic" />
        <RarityLevel type="legendary" />
        <RarityLevel type="divinity" />
      </div>

      <Button type="primary" disabled>
        Coming soon
      </Button>
    </>
  )
}
