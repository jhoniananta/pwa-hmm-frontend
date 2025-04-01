import React, {HTMLAttributes} from 'react';

function Wrapper({children, className, ...props}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='rounded-xl shadow-md w-full bg-white flex-1 p-4 flex flex-col justify-between *:h-full' {...props}>
      {children}
    </div>
    );
}

export default Wrapper;