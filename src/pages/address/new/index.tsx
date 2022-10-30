import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { AddressSchema, IAddress } from "../../../schema/address.schema";

const initialValues = {
  add1: "-",
  add2: "-",
  city: "calgary",
  province: "alberta",
  country: "canada",
  postalCode: "-",
  plusCode: "-",
  note: "-",
  siteId: "",
};

const CreateAddressPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.address.add.useMutation({
    async onSuccess() {
      await utils.address.list.invalidate();
    },
  });
  const siteQuery = trpc.site.list.useQuery();
  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          <Text as="b" fontSize="lg">
            Create Address
          </Text>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IAddress) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/address");
            }}
            validationSchema={toFormikValidationSchema(AddressSchema)}
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

export default CreateAddressPage;
