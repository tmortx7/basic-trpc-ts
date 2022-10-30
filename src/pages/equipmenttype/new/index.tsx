import { Box, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  EquipmentTypeSchema,
  IEquipmentType,
} from "../../../schema/equipmenttype.schema";

const initialValues = {
  equipAlias: "",
  description: "",
};

const CreateEquipmentType: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.equipmenttype.add.useMutation({
    async onSuccess() {
      await utils.equipmenttype.list.invalidate();
    },
  });

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Equipment Type
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IEquipmentType) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/equipmenttype");
            }}
            validationSchema={toFormikValidationSchema(EquipmentTypeSchema)}
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
                <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
              </Stack>
            )}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateEquipmentType;
