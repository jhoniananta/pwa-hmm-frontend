'use client';

import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from '@/components/ui/dialog';
import {Filter} from 'lucide-react';
import {useState} from 'react';

export default function CourseDialog() {
    const [checkedList, setCheckedList] = useState<
        { id: number; checked: boolean }[]
    >(Array.from({length: 9}, (_, i) => ({id: i, checked: false})));
    return (
        <Dialog>
            <DialogTrigger
                className='rounded-full flex items-center md:py-2 gap-2 md:px-4 py-1.5 px-3 data-[state=open]:bg-kuning data-[state=closed]:bg-navy data-[state=closed]:text-white hover:bg-kuning transition drop-shadow-lg font-semibold hover:text-navy md:text-sm text-xs '>
                <Filter className='w-3 md:w-4'/>
                Filter
            </DialogTrigger>
            <DialogContent className=''>
                <DialogTitle className=''>Filter</DialogTitle>
                <div className='grid grid-cols-3 grid-rows-3 gap-4'>
                    <div
                        key={'courses-dialog-sem-'}
                        className='flex items-center space-x-2'
                    >
                        <Checkbox
                            id={'terms'}
                            checked={checkedList.find((v) => v.id === 0)?.checked}
                            onCheckedChange={(c) => {
                                if (c) {
                                    setCheckedList((prev) =>
                                        prev.map((item) => ({...item, checked: true}))
                                    );
                                } else {
                                    setCheckedList((prev) =>
                                        prev.map((item) => ({...item, checked: false}))
                                    );
                                }

                            }}
                        />
                        <label
                            htmlFor={'terms'}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                            All Semester
                        </label>
                    </div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={'courses-dialog-sem-' + i}
                            className='flex items-center space-x-2'
                        >
                            <Checkbox id={'terms' + i} checked={checkedList.find(v => v.id === i)?.checked}
                                      onCheckedChange={(c) => {
                                          if (c) {
                                              setCheckedList((prev) =>
                                                  prev.map((item) => item.id === i ? {...item, checked: true} : item)
                                              );
                                          } else {
                                              setCheckedList((prev) =>
                                                  prev.map((item) => item.id === i ? {...item, checked: false} : item)
                                              );
                                          }

                                      }}/>
                            <label
                                htmlFor={'terms' + i}
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                {`Semester ${i}`}
                            </label>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
