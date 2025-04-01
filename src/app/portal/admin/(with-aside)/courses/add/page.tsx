import AdminHeader from "@/components/admin/header";
import AdminBreadcrumb from "@/components/admin/breadcrumb";
import Wrapper from "@/app/portal/admin/wrapper";
import AddForm from "./add-form";
import { getCategories } from "@/_actions/category-action";

export const dynamic = 'force-dynamic';

export default async function Add() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeader title='Add Course'/>
      <AdminBreadcrumb/>
      <Wrapper>
        <AddForm initialCategories={categories} />
      </Wrapper>
    </>
  );
}