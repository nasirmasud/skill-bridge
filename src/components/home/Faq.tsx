import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type FaqItem = {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "price-snapshot",
    question: "How does order placement and price snapshotting work?",
    answer:
      "When a client orders a service tier, the price is instantly snapshotted into the database. If the seller later adjusts their published service price, your active contract amount remains locked and immutable.",
  },
  {
    id: "order-status",
    question: "How do freelancers transition order statuses?",
    answer:
      "Orders progress through strict database state transitions: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED. Sellers cannot skip states without fulfilling the prerequisite requirements and milestone proofs.",
  },
  {
    id: "review-timing",
    question: "When can a client leave a star review?",
    answer:
      "Reviews are strictly locked until an order reaches the COMPLETED state. This prevents fabricated or retaliatory reviews, guaranteeing that all ratings reflect real, delivered work.",
  },
  {
    id: "escrow",
    question: "Is there an escrow or dispute mitigation system?",
    answer:
      'Yes. Funds are held in escrow when the order is initialized. The seller only receives payout once the client clicks "Accept Delivery" or when the 7-day auto-acceptance period elapses after code verification.',
  },
  {
    id: "social-login",
    question: "Can I sign up with GitHub or Google single sign-on?",
    answer:
      "Skillbridge supports both email/password with secure password hashing and one-click OAuth via GitHub and Google, immediately granting authenticated JWT bearer tokens.",
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      data-slot="faq"
      className="mx-auto w-full max-w-4xl scroll-mt-24 px-margin-mobile py-space-2xl lg:px-margin-desktop"
    >
      <div className="mb-space-xl text-center">
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary">
          Everything Explained
        </span>
        <h2
          id="faq-heading"
          className="mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface"
        >
          Frequently Asked Questions
        </h2>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Direct clarity on transactions, escrow conditions, and seller verification.
        </p>
      </div>

      <Accordion
        id="faq-accordion"
        data-slot="faq-accordion"
        type="single"
        collapsible
        defaultValue="price-snapshot"
        className="gap-4"
      >
        {FAQ_ITEMS.map(({ id, question, answer }) => (
          <AccordionItem
            key={id}
            value={id}
            data-faq-id={id}
            className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-5 py-4 transition-colors hover:border-primary/50 hover:bg-surface-container-low data-[state=open]:border-primary/60 data-[state=open]:bg-surface-container"
          >
            <AccordionTrigger className="gap-4 rounded-lg py-0 font-headline-sm text-headline-sm font-medium text-on-surface hover:no-underline">
              {question}
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0 pt-3 font-body-sm text-body-sm text-on-surface-variant">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
