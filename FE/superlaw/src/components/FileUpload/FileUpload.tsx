import { ChangeEvent, useRef, useState } from 'react';
import './FileUpload.scss';
import { Button } from 'react-bootstrap';

interface Props {
    onFileSelectSuccess: (file: File) => void,
    onFileSelectError: (error: string) => void,
}

const FileUpload: React.FC<Props> = ({
    onFileSelectSuccess,
    onFileSelectError
}) => {
    const [fileName, setFileName] = useState('');

    const inputFilesRef = useRef<HTMLInputElement>(null);

    const handleBtnClick = () => {
        if (inputFilesRef.current) {
            inputFilesRef.current.click();
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            onFileSelectError('Не е качен файл');
            return;
        }
        const file = e.target.files[0];

        if (file.type !== 'image/png' && file.type !== 'image/jpeg'){
            onFileSelectError('Снимката трябва да е .png или .jpeg');
            return;
        }

        setFileName(file.name);
        onFileSelectSuccess(file);
    };

    return (
        <div className="file-upload">
            <p>{fileName}</p>
            <input type="file" ref={inputFilesRef} onChange={handleFileInput}/>
            <Button variant="success" className='btn' onClick={handleBtnClick}>Търсете във файлове</Button>
        </div>
    );
};

export default FileUpload;