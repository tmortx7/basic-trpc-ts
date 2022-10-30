import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Formik } from "formik";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import NextError from "next/error";
import router, { useRouter } from "next/router";
import superjson from "superjson";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import {
  EditAddressSchema,
  IEditAddress,
} from "../../../schema/address.schema";

import { appRouter } from "../../../server/routers/_app";
import { trpc } from "../../../utils/trpc";

const EditAddressPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = trpc.useContext();
  const mutation = trpc.address.edit.useMutation({
    async onSuccess() {
      await utils.address.list.invalidate();
    },
  });

  const id = useRouter().query.id as string;
  const addressQuery = trpc.address.byId.useQuery({ id });

  if (addressQuery.error) {
    return (
      <NextError
        title={addressQuery.error.message}
        statusCode={addressQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (addressQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = addressQuery;
  const siteQuery = trpc.site.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Edit Address
          <Formik
            initialValues={{
              id: data.id,
              plusCode: data.plusCode,
              add1: data.add1,
              add2: data.add2,
              city: data.city,
              province: data.province,
              postalCode: data.postalCode,
              country: data.country,
              note: data.note,
              siteId: data.siteId,
            }}
            onSubmit={async (values: IEditAddress) => {
              mutation.mutate(values);
              router.push("/address");
            }}
            validationSchema={toFormikValidationSchema(EditAddressSchema)}
          >
            {({ handleSubmit }) => (
              <Stack
                spacing={2}
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
                  {siteQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.site}</option>
                  ))}
                </SelectControl>
                <HStack spacing={"4"}>
                  <InputControl
                    name="add1"
                    label="Address 1"
                    inputProps={{ autoComplete: "off" }}
                  />
                  <InputControl
                    name="add2"
                    label="Address 2"
                    inputProps={{ autoComplete: "off" }}
                  />
                </HStack>
                <HStack spacing={"4"}>
                  <InputControl
                    name="city"
                    label="City"
                    inputProps={{ autoComplete: "off" }}
                  />
                  <InputControl
                    name="province"
                    label="Province"
                    inputProps={{ autoComplete: "off" }}
                  />
                </HStack>
                <HStack>
                  <InputControl
                    name="country"
                    label="country"
                    inputProps={{ autoComplete: "off" }}
                  />

                  <InputControl
                    name="postalCode"
                    label="Postal Code"
                    inputProps={{ autoComplete: "off" }}
                  />
                </HStack>
                <InputControl
                  name="plusCode"
                  label="PlusCode"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="note"
                  label="Note"
                  inputProps={{ autoComplete: "off" }}
                />

                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/address")}>
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
  await ssg.address.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditAddressPage;
