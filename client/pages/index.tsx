import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import axios from 'axios';

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

const Home: NextPage = () => {
  const [values, setValues] = React.useState<{ [index: string]: string; }>({});
  const [indexes, setIndexes] = React.useState<number[]>([]);
  const [number, setNumber] = React.useState<string>('');

  React.useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const values = await axios.get('/api/values/current');
      const indexes = await axios.get('/api/values/all');

      setValues(values.data);
      setIndexes(indexes.data);
    } catch (e) { }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      await axios.post('/api/values', { index: number });

      setNumber('');
    } catch (e) { }
  };

  const renderCalculatedValues = () => {
    return (
      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th isNumeric>Index</Th>
              <Th isNumeric>Calculated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              Object.keys(values).map((value) => {
                return (
                  <Tr>
                    <Td>{value}</Td>
                    <Td>{values[value]}</Td>
                  </Tr>
                );
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Fibonacci Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Fibonacci Calculator
        </h1>

        <form style={{ padding: 25 }} onSubmit={onSubmit}>
          <FormControl>
            <FormLabel htmlFor='number'>Enter a number:</FormLabel>
            <Input id='number' name='number' type='number' placeholder='10' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)} />
            <FormHelperText>The number you want to calculate its Fibonacci.</FormHelperText>
          </FormControl>

          <Button type='submit' style={{ marginTop: 20, width: '100%' }}>Calculate</Button>
        </form>

        {renderCalculatedValues()}
      </main>
    </div>
  );
};

export default Home;
