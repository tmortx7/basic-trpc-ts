import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import router, { useRouter } from "next/router";
import NextError from "next/error";
import { trpc } from "../../../utils/trpc";
import React from "react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/routers/_app";
import {
  EditInstrumentFunctionSchema,
  IEditInstrumentFunction,
} from "../../../schema/instrumentfunction.schema";

const EditInstrumentFunctionPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.instrumentfunction.edit.useMutation({
    async onSuccess() {
      await utils.instrumentfunction.list.invalidate();
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const instxQuery = trpc.instrumentfunction.byId.useQuery({ id });

  if (instxQuery.error) {
    return (
      <NextError
        title={instxQuery.error.message}
        statusCode={instxQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (instxQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = instxQuery;

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Instrument Function
          <Formik
            initialValues={{
              id: data.id,
              instrumentfunction: data.instrumentfunction,
              alias: data.alias,
            }}
            onSubmit={async (values: IEditInstrumentFunction) => {
              mutation.mutate(values);
              router.push("/instrumentfunction");
            }}
            validationSchema={toFormikValidationSchema(
              EditInstrumentFunctionSchema
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
                <InputControl
                  name="instrumentfunction"
                  label="Function"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="alias"
                  label="Alias"
                  inputProps={{ autoComplete: "off" }}
                />

                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/instrumentfunction")}>
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
  await ssg.instrumentfunction.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditInstrumentFunctionPage;
