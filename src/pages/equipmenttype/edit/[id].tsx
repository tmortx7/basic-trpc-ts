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
  EditEquipmentTypeSchema,
  IEditEquipmentType,
} from "../../../schema/equipmenttype.schema";

import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditEquipmentTypePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.equipmenttype.edit.useMutation({
    async onSuccess() {
      await utils.equipmenttype.list.invalidate();
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const equipQuery = trpc.equipmenttype.byId.useQuery({ id });

  if (equipQuery.error) {
    return (
      <NextError
        title={equipQuery.error.message}
        statusCode={equipQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (equipQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = equipQuery;
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Equipment Type
          <Formik
            initialValues={{
              id: data.id,
              equipmenttype: data.equipmenttype,
              description: data.description,
            }}
            onSubmit={async (values: IEditEquipmentType) => {
              mutation.mutate(values);
              router.push("/equipmenttype");
            }}
            validationSchema={toFormikValidationSchema(EditEquipmentTypeSchema)}
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
                  name="equipAlias"
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
                  <Button onClick={() => router.push("/equipmenttype")}>
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
  await ssg.equipmenttype.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditEquipmentTypePage;
