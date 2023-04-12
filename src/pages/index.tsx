import Head from 'next/head';
import { useState } from 'react';
import { dehydrate } from 'react-query/hydration';
import { useQuery, QueryClient } from 'react-query';

type ResultUser = {
	gender: string;
	name: { first: string; last: string };
	dob: { age: number };
	location: {
		street: {
			number: number;
		};
		postcode: number;
	};
	email: string;
	picture: { thumbnail: string };
};

type PageProps = {
	initialUser: ResultUser[];
};

// SRR with Initial Data
// export async function getStaticProps() {
// 	const initialUser = await getUser();
// 	return { props: { initialUser } };
// }

// SRR with Hydrate
export async function getStaticProps() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['market', 1], () => getUser());
	return { props: { dehydratedState: dehydrate(queryClient) } };
}

const getUser = async (page: number = 1) => {
	const URL = `https://randomuser.me/api/?page=${page}&results=5`;
	const res = await fetch(URL);
	if (!res.ok) {
		throw new Error('Invalid URL');
	}
	return await res.json();
};

const settingNumber = (num: number) => {
	return Intl.NumberFormat('id-Id').format(num);
};

const AgeValue = ({ score }: { score: number }) => {
	const settingNumber = Intl.NumberFormat('id-Id').format(score);
	let color = 'text-dark fw-bold';
	if (score < 35) {
		color = 'text-success fw-bold';
	} else if (score > 35) {
		color = 'text-danger fw-bold';
	}
	return (
		<>
			<p className={color}>{settingNumber}</p>
		</>
	);
};

const GenderSetting = ({ gender }: { gender: string }) => {
	const setGender = gender.charAt(0).toUpperCase() + gender.slice(1);
	let color = 'text-dark fw-bold';
	if (gender === 'female') {
		color = 'text-warning fw-bold';
	} else if (gender === 'male') {
		color = 'text-info fw-bold';
	}

	return (
		<>
			<p className={color}>{setGender}</p>
		</>
	);
};

export default function Home() {
	const [page, setPage] = useState(1);
	const { data, isSuccess, isError, isFetching } = useQuery(
		['market', page],
		() => getUser(page),
		{
			staleTime: 3000,
			refetchInterval: 3000,
			// initialData: initialUser, // ini untuk Initial State ajaa :))
		}
	);
	const nextPage = () => {
		return setPage((old) => old + 1);
	};
	const prevPage = () => {
		return setPage((old) => old - 1);
	};
	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<main>
				<h1>User</h1>
				<div className="mt-4">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">No.</th>
								<th scope="col">Email</th>
								<th scope="col">First Name</th>
								<th scope="col">Last Name</th>
								<th scope="col">Postcode</th>
								<th scope="col">Street Number</th>
								<th scope="col">Gender</th>
								<th scope="col">Age</th>
								<th scope="col" className="text-center">
									Avatar
								</th>
							</tr>
						</thead>
						<tbody>
							{isError && (
								<p className="fw-bold mt-3">
									There was an error processing your request ..
								</p>
							)}
							{isSuccess &&
								data?.results.map((user: ResultUser, index: number) => (
									<tr key={index}>
										<th scope="row">{++index}</th>
										<td>{user.email}</td>
										<td>{user.name.first}</td>
										<td>{user.name.last}</td>
										<td>{settingNumber(user.location.postcode)}</td>
										<td>{settingNumber(user.location.street.number)}</td>
										<td>
											<GenderSetting gender={user.gender} />
										</td>
										<td>
											<AgeValue score={user.dob.age} />
										</td>
										<td className="text-center">
											<picture>
												<img
													src={user.picture.thumbnail}
													alt={user.email}
													width={50}
													height={50}
													className="img-thumbnail text-center"
												/>
											</picture>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<div className="justify-content-between d-flex">
						<div className="">
							{isFetching && (
								<span className="fw-bold mt-3">Loading Stale ..</span>
							)}
						</div>
						<div className="">
							<button
								className="btn btn-primary"
								onClick={prevPage}
								disabled={page === 1 ? true : false}
							>
								Prev
							</button>
							<span className="fw-bold mx-4">{page}</span>
							<button className="btn btn-primary" onClick={nextPage}>
								Next
							</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
