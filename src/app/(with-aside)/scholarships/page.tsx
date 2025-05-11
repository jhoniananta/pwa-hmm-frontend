import BeasiswaInternalBanner from './beasiswa-internal-banner';
import {ScholarshipsPage} from "@/app/(with-aside)/scholarships/scholarships-page";
import {getScholarships} from "@/_actions/scholarship-action";
import {getTags} from "@/_actions/tag-action";

export const dynamic = 'force-dynamic';

const Scholarships = async () => {
    const pageId = 'scholarships';

    const scholarships = await getScholarships()
    const tags = await getTags()

    return (
        <>
            <BeasiswaInternalBanner/>
            <h2 className='md:text-lg text-base font-semibold'>
                Other Scholarship
            </h2>
            <ScholarshipsPage scholarships={scholarships} tags={tags}/>
        </>
    );
};

export const metadata = {
    title: 'Scholarships',
};

export default Scholarships;
