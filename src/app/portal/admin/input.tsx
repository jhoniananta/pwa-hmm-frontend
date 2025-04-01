import {Input as ShadInput} from "@/components/ui/input";
import {Label as ShadLabel} from "@/components/ui/label";
import {HTMLAttributes, HTMLInputTypeAttribute} from "react";
import {cn} from "@/lib/utils";

function Input({className, type, ...props}: HTMLAttributes<HTMLInputElement> & {type?: HTMLInputTypeAttribute, placeholder?: string}) {
  return (
    <ShadInput type={type} className={cn('bg-transparent border border-navy mb-4', className)} {...props} />
  );
}

function Label({className, ...props}: HTMLAttributes<HTMLLabelElement>) {
  return <ShadLabel className={cn('font-semibold md:text-lg', className)} {...props}></ShadLabel>
}

export  {Input, Label};