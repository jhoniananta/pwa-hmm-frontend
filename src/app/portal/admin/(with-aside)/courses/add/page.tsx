import AdminHeader from "@/components/admin/header";
import AddForm from "./add-form";
import Wrapper from "../../../wrapper";
import AdminBreadcrumb from "@/components/admin/breadcrumb";

export default async function Add() {

    return (
        <>
            <AdminHeader title='Add Course'/>
            <AdminBreadcrumb/>
            <div className={'flex-2'}>
                <Wrapper>
                    <AddForm/>
                </Wrapper>
            </div>
        </>
    );
}