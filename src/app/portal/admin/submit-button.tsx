import {Button} from "@/components/ui/button";

export default function SubmitButton({children}: {children: React.ReactNode}) {
  return (
    <Button type='submit' className='bg-navy text-white place-self-end'>
      {children}
    </Button>
  );
}