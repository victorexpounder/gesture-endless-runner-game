import React, { use, useEffect, useState } from 'react';
import { Table } from 'antd';
import { anonkey, supabaseUrl } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

const supabase = createClient(supabaseUrl, anonkey);

const TableComponent = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(JSON.parse(localStorage.getItem("countries")));
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const player = JSON.parse(localStorage.getItem("player"));
    if (!player) return;

    setCurrentPlayer(player);

    // Fetch top 5 players
    const { data: topPlayers, error } = await supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false })
      .limit(3);

    if (error) console.log("Leaderboard Error:", error);

    // Fetch the current player's rank if they're not in the top 5
    const { data: playerRankData } = await supabase
      .rpc('get_rank', { player_id: player.id });

    if (!topPlayers) return;

    const isCurrentPlayerInTop5 = topPlayers.some(p => p.id === player.id);
    
    let leaderboard = topPlayers.map((p, index) => ({
      key: index + 1,
      name: `${p.name} `,
      distance: p.score,
      country: p.country,
      isCurrent: p.id === player.id
    }));

    
    if (!isCurrentPlayerInTop5 && playerRankData?.[0]) {
      leaderboard.push({
        key: playerRankData[0].rank, 
        name: `${player.name}`,
        distance: player.score,
        country: player.country,
        isCurrent: true
      });
    }

    setPlayers(leaderboard);
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render : (text, record) => {
        const countryData = countries?.find((country) => country.name.common === record.country);
        return (
          <div>
            <span>{record.isCurrent ? <b>You</b> : text}</span>
            <Image
              src={countryData.flags.png}
              alt={countryData.name.common}
              width={20}
              height={20}
            />
          </div>
        );
      }
    },
    {
      title: 'Score',
      dataIndex: 'distance',
      key: 'distance',
    },
  ];

  return (
    <>
      {players.length > 0 ? 
        
        <Table 
          columns={columns} 
          dataSource={players} 
          pagination={false} 
          rowClassName={(record) => record.isCurrent ? 'bg-blue-500 text-white' : ''}
          
        />
        :
        <p>Loading...</p>
      }
    </>
  );
};

export default TableComponent;
