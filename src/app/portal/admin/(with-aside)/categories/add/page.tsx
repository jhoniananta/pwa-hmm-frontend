import AdminHeader from "@/components/admin/header";
import AdminBreadcrumb from "@/components/admin/breadcrumb";
import Wrapper from "@/app/portal/admin/wrapper";
import AddForm from "./add-form";

export default function Add() {
    return <>
        <AdminHeader title='Add Category'/>
        <AdminBreadcrumb/>
        <div className={'flex-2'}>
            <Wrapper>
                <AddForm/>
            </Wrapper>
        </div>

    </>
} 