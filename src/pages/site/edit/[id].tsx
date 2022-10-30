import { Box, Flex, Stack } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Formik } from "formik";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import NextError from "next/error";
import router, { useRouter } from "next/router";
import superjson from "superjson";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { EditSiteSchema, IEditSite } from "../../../schema/site.schema";

import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditSitePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.site.edit.useMutation({
    async onSuccess() {
      await utils.site.list.invalidate();
    },
  });

  const id = useRouter().query.id as string;
  const siteQuery = trpc.site.byId.useQuery({ id });

  if (siteQuery.error) {
    return (
      <NextError
        title={siteQuery.error.message}
        statusCode={siteQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (siteQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = siteQuery;
  const deptQuery = trpc.department.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Site
          <Formik
            initialValues={{
              id: data.id,
              site: data.site,
              siteAlias: data.siteAlias,
              deptId: data.deptId,
              description: data.description,
            }}
            onSubmit={async (values: IEditSite) => {
              mutation.mutate(values);
              router.push("/site");
            }}
            validationSchema={toFormikValidationSchema(EditSiteSchema)}
          >
            {({ handleSubmit }) => (
              <Stack
                spacing={5}
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={400}
                p={6}
                m="10px auto"
                as="form"
                onSubmit={handleSubmit as any}
              >
                <SelectControl
                  label="Department"
                  name="deptId"
                  selectProps={{ placeholder: "Select Dept" }}
                >
                  {deptQuery.data?.map((deptx: any) => (
                    <option value={deptx.id}>{deptx.dept}</option>
                  ))}
                </SelectControl>
                <InputControl
                  name="site"
                  label="Name"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="siteAlias"
                  label="Alias"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="description"
                  label="Description"
                  inputProps={{ autoComplete: "off" }}
                />

                <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
              </Stack>
            )}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });
  const id = context.params?.id as string;
  // Prefetch `post.byId`
  await ssg.site.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditSitePage;
