import { Box, Flex, Stack } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Formik } from "formik";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import NextError from "next/error";
import router, { useRouter } from "next/router";
import superjson from "superjson";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import {
  EditEquipmentSchema,
  IEditEquipment,
} from "../../../schema/equipment.schema";

import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditEquipmentPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.equipment.edit.useMutation({
    async onSuccess() {
      await utils.equipment.list.invalidate();
    },
  });

  const id = useRouter().query.id as string;
  const equipQuery = trpc.equipment.byId.useQuery({ id });

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
  const siteQuery = trpc.site.list.useQuery();
  const equipTypeQuery = trpc.equipmenttype.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Equipment
          <Formik
            initialValues={{
              id: data.id,
              prefix: data.prefix,
              description: data.description,
              siteId: data.siteId,
              equiptypeId: data.equiptypeId,
            }}
            onSubmit={async (values: IEditEquipment) => {
              mutation.mutate(values);
              router.push("/equipment");
            }}
            validationSchema={toFormikValidationSchema(EditEquipmentSchema)}
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
                  label="Site"
                  name="siteId"
                  selectProps={{ placeholder: "Select Site" }}
                >
                  {siteQuery.data?.map((sitex: any) => (
                    <option value={sitex.id}>
                      {sitex.site} - {sitex.siteAlias}
                    </option>
                  ))}
                </SelectControl>
                <SelectControl
                  label="Type"
                  name="equiptypeId"
                  selectProps={{ placeholder: "Select Type" }}
                >
                  {equipTypeQuery.data?.map((typex: any) => (
                    <option value={typex.id}>
                      {typex.description} - {typex.equipAlias}
                    </option>
                  ))}
                </SelectControl>
                <InputControl
                  name="description"
                  label="Description"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="prefix"
                  label="Alias"
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
  await ssg.equipment.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditEquipmentPage;
