import AdminHeader from "@/components/admin/header";
import AdminBreadcrumb from "@/components/admin/breadcrumb";
import Wrapper from "@/app/portal/admin/wrapper";
import AddForm from "./add-form";
import {getTags} from "@/_actions/tag-action";

export const dynamic = 'force-dynamic';

export default async function Add() {

    const tagsAll = await getTags();
    return <>
        <AdminHeader title='Add Scholarship'/>
        <AdminBreadcrumb/>
        <Wrapper>
            <AddForm tags={tagsAll}/>
        </Wrapper>
    </>
} 