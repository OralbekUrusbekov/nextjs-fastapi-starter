"""Initial migration

Revision ID: a63a054ca768
Revises: ec4e292c1786
Create Date: 2024-11-26 08:54:30.962498

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a63a054ca768'
down_revision: Union[str, None] = 'ec4e292c1786'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('catalogs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('description2', sa.String(), nullable=True),
    sa.Column('description3', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_catalogs_id'), 'catalogs', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_catalogs_id'), table_name='catalogs')
    op.drop_table('catalogs')
    # ### end Alembic commands ###
