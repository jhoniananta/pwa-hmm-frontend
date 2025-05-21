import Assignment from './assignment';
import {getUserAssignments} from '@/_actions/assignment-action';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const assignments =
        await getUserAssignments()

    return (
        <>
            <Assignment
                assignments={assignments}
            />
        </>
    );
}

export const metadata = {
    title: 'Assignments',
};
