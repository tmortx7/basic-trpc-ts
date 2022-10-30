import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Formik } from "formik";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import NextError from "next/error";
import router, { useRouter } from "next/router";
import superjson from "superjson";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl, SubmitButton } from "../../../components";
import {
  EditDepartmentSchema,
  IEditDepartment,
} from "../../../schema/department.schema";
import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditDepartmentPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.department.edit.useMutation({
    async onSuccess() {
      await utils.department.list.invalidate();
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const deptQuery = trpc.department.byId.useQuery({ id });

  if (deptQuery.error) {
    return (
      <NextError
        title={deptQuery.error.message}
        statusCode={deptQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (deptQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = deptQuery;

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Department
          <Formik
            initialValues={{
              id: data.id,
              dept: data.dept,
              deptAlias: data.deptAlias,
              description: data.description,
            }}
            onSubmit={async (values: IEditDepartment) => {
              mutation.mutate(values);
              router.push("/department");
            }}
            validationSchema={toFormikValidationSchema(EditDepartmentSchema)}
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
                <InputControl
                  name="dept"
                  label="Department"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="deptAlias"
                  label="Alias"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="description"
                  label="Description"
                  inputProps={{ autoComplete: "off" }}
                />
                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/department")}>
                    Cancel
                  </Button>
                </ButtonGroup>
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
  await ssg.department.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditDepartmentPage;
