export default function ErrorText({children}: {children?: React.ReactNode}) {
  return (
    <div className='text-red-600 text-xs md:text-sm'>
      {children ?? "Error! Please check your input."}
    </div>
  );
}