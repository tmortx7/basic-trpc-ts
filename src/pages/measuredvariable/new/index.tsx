import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  IMeasuredVariable,
  MeasuredVariableSchema,
} from "../../../schema/measuredvariable.schema";

const initialValues = {
  variable: "",
  mvalias: "",
};

const CreateMeasuredVariablePage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.measuredvariable.add.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
    },
  });

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Measured Variable
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IMeasuredVariable) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/measuredvariable");
            }}
            validationSchema={toFormikValidationSchema(MeasuredVariableSchema)}
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
                  name="variable"
                  label="Variable"
                  inputProps={{ autoComplete: "off" }}
                />
                <InputControl
                  name="mvalias"
                  label="Alias"
                  inputProps={{ autoComplete: "off" }}
                />
                <ButtonGroup>
                  <SubmitButton colorScheme={"blue"}>Submit</SubmitButton>
                  <Button onClick={() => router.push("/measuredvariable")}>
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

export default CreateMeasuredVariablePage;
