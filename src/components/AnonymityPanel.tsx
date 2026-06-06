import { IconShieldCheck, IconCheck } from '@tabler/icons-react'
import { Reveal } from '@/components/motion/Reveal'

const GUARANTEES = [
  'We do not ask for your name or email address, and you do not need to sign in.',
  'One shared link is used for all employees, so responses cannot be linked to an individual.',
  'Free-text responses are anonymized by AI before analysis.',
  'Department results are only visible after several responses have been submitted.',
  'We do not store IP addresses, device information, or exact submission times.',
  'HR only sees aggregated insights, never individual responses.',
]

export function AnonymityPanel() {
  return (
    <Reveal
      variant="fade"
      className="rounded-lg border border-primary/20 bg-primary/5 p-4"
    >
      <div className="flex items-center gap-2 font-medium text-primary">
        <IconShieldCheck className="size-5" />
        Fully anonymous, and here is how we ensure it
      </div>

      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {GUARANTEES.map((g, i) => (
          // Calm cascade: guarantees "settle" one after another, building trust.
          <Reveal as="li" key={g} index={i} step={70} delay={120} className="flex items-start gap-2">
            <IconCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{g}</span>
          </Reveal>
        ))}
      </ul>
    </Reveal>
  )
}
