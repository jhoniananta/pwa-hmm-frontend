import AdminHeader from "@/components/admin/header";
import AdminBreadcrumb from "@/components/admin/breadcrumb";
import Wrapper from "@/app/portal/admin/wrapper";
import AddForm from "./add-form";

export const dynamic = 'force-dynamic';

export default async function Add() {

    return (
        <>
            <AdminHeader title='Add Course'/>
            <AdminBreadcrumb/>
            <Wrapper>
                <AddForm/>
            </Wrapper>
        </>
    );
}