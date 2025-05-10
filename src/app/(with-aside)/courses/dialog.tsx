'use client';

import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from '@/components/ui/dialog';
import {Filter} from 'lucide-react';
import {Dispatch, SetStateAction} from "react";

interface CourseDialogProps {
    checkedList: { id: number; title: string, checked: boolean }[];
    setCheckedList: Dispatch<SetStateAction<{ id: number; title: string, checked: boolean }[]>>;
}

export default function CourseDialog({checkedList, setCheckedList}: CourseDialogProps) {
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
                    {checkedList.map((checked) => (
                        <div
                            key={'courses-dialog-sem-' + checked.id}
                            className='flex items-center space-x-2'
                        >
                            <Checkbox id={'terms' + checked.id}
                                      checked={checkedList.find(v => v.id === checked.id)?.checked}
                                      onCheckedChange={(c) => {
                                          if (c) {
                                              setCheckedList((prev) =>
                                                  prev.map((item) => item.id === checked.id ? {
                                                      ...item,
                                                      checked: true
                                                  } : item)
                                              );
                                          } else {
                                              setCheckedList((prev) =>
                                                  prev.map((item) => item.id === checked.id ? {
                                                      ...item,
                                                      checked: false
                                                  } : item)
                                              );
                                          }

                                      }}/>
                            <label
                                htmlFor={'terms' + checked.id}
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                {`${checked.title}`}
                            </label>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
