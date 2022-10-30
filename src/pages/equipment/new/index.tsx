import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { EquipmentSchema, IEquipment } from "../../../schema/equipment.schema";

const initialValues = {
  prefix: "",
  description: "",
  siteId: "",
  equiptypeId: "",
};

const CreateEquipment: NextPage = () => {
  const router = useRouter();
  const mutation = trpc.equipment.add.useMutation();
  const siteQuery = trpc.site.list.useQuery();
  const equipTypeQuery = trpc.equipmenttype.list.useQuery();

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Equipment
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IEquipment) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/equipment");
            }}
            validationSchema={toFormikValidationSchema(EquipmentSchema)}
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
                  label="Prefix"
                  inputProps={{ autoComplete: "off" }}
                />
                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/equipment")}>
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

export default CreateEquipment;
