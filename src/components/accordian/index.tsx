import React from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger, Accordion as ShadcnAccordion } from '@/components/ui/accordion'

type Props = {
  trigger: string
  content: string
}

const Accordion = ({ content, trigger }: Props) => {
  return (
    <ShadcnAccordion
      type="single"
      collapsible
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{trigger}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </ShadcnAccordion>
  )
}

export default Accordion
