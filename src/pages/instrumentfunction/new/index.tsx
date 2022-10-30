import { Box, Button, ButtonGroup, Flex, Stack } from "@chakra-ui/react";
import { InputControl, SelectControl, SubmitButton } from "../../../components";
import { NextPage } from "next";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import {
  IInstrumentFunction,
  InstrumentFunctionSchema,
} from "../../../schema/instrumentfunction.schema";

const initialValues = {
  instrumentfunction: "",
  alias: "",
};

const CreateInstrumentFunctionPage: NextPage = () => {
  const router = useRouter();
  const mutation = trpc.instrumentfunction.add.useMutation();

  return (
    <div>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Box bg="white" p={6} rounded="md">
          Create Instrument Function
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: IInstrumentFunction) => {
              mutation.mutate(values);
              console.log(values);
              router.push("/instrumentfunction");
            }}
            validationSchema={toFormikValidationSchema(
              InstrumentFunctionSchema
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

export default CreateInstrumentFunctionPage;
