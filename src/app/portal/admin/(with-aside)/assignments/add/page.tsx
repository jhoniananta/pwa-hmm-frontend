import AdminHeader from "@/components/admin/header";
import AdminBreadcrumb from "@/components/admin/breadcrumb";
import Wrapper from "@/app/portal/admin/wrapper";
import AddForm from "./add-form";
import {getCourses} from "@/_actions/courses-action";
import {getClasses} from "@/_actions/class-action";

export const dynamic = 'force-dynamic';

export default async function Add() {
  const courses = await getCourses();
  const classes_ = await Promise.all(courses.flatMap(async course => {
    const c_ = await getClasses(course.id);
    return c_.map(c => ({...c, courseId: course.id}));
  }));

  const classes = classes_.flat();
  return <>
    <AdminHeader title='Add Assignment'/>
    <AdminBreadcrumb/>
    <Wrapper>
      <AddForm courses={courses} classes={classes}/>
    </Wrapper>
  </>
}