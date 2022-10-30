import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Formik } from "formik";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import NextError from "next/error";
import router, { useRouter } from "next/router";
import superjson from "superjson";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import {
  EditInstrumentTypeSchema,
  IEditInstrumentType,
} from "../../../schema/instrumenttype.schema";
import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditInstrumentPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.instrument.edit.useMutation({
    async onSuccess() {
      await utils.instrument.list.invalidate();
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const instrumentQuery = trpc.instrument.byId.useQuery({ id });

  if (instrumentQuery.error) {
    return (
      <NextError
        title={instrumentQuery.error.message}
        statusCode={instrumentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (instrumentQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = instrumentQuery;
  const mvQuery = trpc.measuredvariable.list.useQuery();
  const funcQuery = trpc.instrumentfunction.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Instrument
          <Formik
            initialValues={{
              id: data.id,
              mvId: data.mvId,
              instfunctionId: data.instfunctionId,
              description: data.description,
            }}
            onSubmit={async (values: IEditInstrumentType) => {
              mutation.mutate(values);
              router.push("/instrument");
            }}
            validationSchema={toFormikValidationSchema(
              EditInstrumentTypeSchema
            )}
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
                  label="Measured Variable"
                  name="mvId"
                  selectProps={{ placeholder: "Select MV" }}
                >
                  {mvQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.variable}</option>
                  ))}
                </SelectControl>
                <SelectControl
                  label="Instrument Function"
                  name="instfunctionId"
                  selectProps={{ placeholder: "Select Function" }}
                >
                  {funcQuery.data?.map((funcx: any) => (
                    <option value={funcx.id}>{funcx.instrumentfunction}</option>
                  ))}
                </SelectControl>

                <InputControl
                  name="description"
                  label="Description"
                  inputProps={{ autoComplete: "off" }}
                />

                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/instrumenttype")}>
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
  await ssg.instrument.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditInstrumentPage;
