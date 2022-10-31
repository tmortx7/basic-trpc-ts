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
  EditInstrumentTagSchema,
  IEditInstrumentTag,
} from "../../../schema/instrumenttag.schema";

import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditInstrumentTagPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.instrumenttag.edit.useMutation({
    async onSuccess() {
      await utils.instrumenttag.list.invalidate();
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const tagQuery = trpc.instrumenttag.byId.useQuery({ id });

  if (tagQuery.error) {
    return (
      <NextError
        title={tagQuery.error.message}
        statusCode={tagQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (tagQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = tagQuery;
  const equipQuery = trpc.equipment.list.useQuery();
  const instrumenttypeQuery = trpc.instrumenttype.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Instrument Tag
          <Formik
            initialValues={{
              id: data.id,
              tag: data.tag,
              equipmentId: data.equipmentId,
              instrumenttypeId: data.instrumenttypeId,
            }}
            onSubmit={async (values: IEditInstrumentTag) => {
              mutation.mutate(values);
              router.push("/instrumenttag");
            }}
            validationSchema={toFormikValidationSchema(EditInstrumentTagSchema)}
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
                  label="Equipment"
                  name="equipmentId"
                  selectProps={{ placeholder: "Select Equipment" }}
                >
                  {equipQuery.data?.map((equipx: any) => (
                    <option value={equipx.id}>{equipx.description}</option>
                  ))}
                </SelectControl>
                <SelectControl
                  label="Instrument Type"
                  name="instrumenttypeId"
                  selectProps={{ placeholder: "Select Instrument Type" }}
                >
                  {instrumenttypeQuery.data?.map((typex: any) => (
                    <option value={typex.id}>{typex.description}</option>
                  ))}
                </SelectControl>
                <InputControl
                  name="tag"
                  label="Tag"
                  inputProps={{ autoComplete: "off" }}
                />

                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/instrumenttag")}>
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
  await ssg.instrumenttag.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditInstrumentTagPage;
