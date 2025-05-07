import AdminHeader from "@/components/admin/header";
import AddForm from "./add-form";

export default async function Add() {

    return (
        <>
            <AdminHeader title='Add Course'/>
            {/*<AdminBreadcrumb/>*/}
            {/*<Wrapper>*/}
            <AddForm/>
            {/*</Wrapper>*/}
        </>
    );
}