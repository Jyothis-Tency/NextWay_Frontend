import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I create an account?</AccordionTrigger>
          <AccordionContent>
            To create an account, click on the "Sign Up" button in the top right
            corner of the homepage. Fill in your details, including your name,
            email address, and password. Once you've completed the form, click
            "Create Account" to finish the process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How can I search for jobs?</AccordionTrigger>
          <AccordionContent>
            You can search for jobs using the search bar on the homepage. Enter
            keywords related to the job title, skills, or company you're
            interested in. You can also filter results by location, job type,
            and salary range to find the most relevant opportunities.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do I apply for a job?</AccordionTrigger>
          <AccordionContent>
            To apply for a job, click on the job listing that interests you. On
            the job details page, you'll find an "Apply Now" button. Click this
            button and follow the instructions to submit your application, which
            may include uploading your resume and cover letter.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            Is my personal information secure?
          </AccordionTrigger>
          <AccordionContent>
            Yes, we take the security of your personal information very
            seriously. We use industry-standard encryption and security measures
            to protect your data. We also have a strict privacy policy that
            outlines how we collect, use, and protect your information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FAQ;
