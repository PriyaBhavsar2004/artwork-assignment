 import { useEffect, useState } from 'react';
import { DataTable} from 'primereact/datatable'; 
import type{DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); 
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

  
  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const fetchArtworks = (page: number = 0) => {
    setLoading(true);
    console.log("Fetching page:", page + 1);

    fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data.data);
        setTotalRecords(data.pagination.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  };

  const onPageChange = (e: DataTablePageEvent) => {
  setPage(e.page ?? 0);
};

  const onSelectionChange = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value);
  };

  return (
    <div className="card m-4">
      <h2 className="mb-3">Artwork Table</h2>

      <DataTable
        value={artworks}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        selectionMode="multiple"
        dataKey="id"
        paginator
        rows={10}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        first={page * 10}
        loading={loading}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Year" />
        <Column field="date_end" header="End Year" />
      </DataTable>

      <div className="mt-4">
        <h3>Selected Artworks:</h3>
        {selectedRows.length === 0 ? (
          <p>No artworks selected.</p>
        ) : (
          <ul>
            {selectedRows.map((art) => (
              <li key={art.id}>{art.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
